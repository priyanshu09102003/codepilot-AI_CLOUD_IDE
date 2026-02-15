import {StateEffect , StateField} from "@codemirror/state"
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap,
} from "@codemirror/view";



const setSuggestionEffect = StateEffect.define<string | null>();

const suggestionState = StateField.define<string | null>({
    create() {
        return null;
    },
    update(value, transaction){
        //Check each effect in this transaction
        //If we find our suggetions, return its new Value
        //Else, keep the current value unchanged

        for(const effect of transaction.effects){
            if(effect.is(setSuggestionEffect)){
                return effect.value;
            }
        }

        return value;
    }
})



class SuggestionWidget extends WidgetType{
    constructor(readonly text: string){
        super()
    }

    toDOM(){
        const span = document.createElement("span");
        span.textContent = this.text;
        span.style.pointerEvents = "none";
        return span;
    }
}


//Creating a debounce to load the suggestion

let debounceTimer: number | null = null;
let isWaitingForSuggestion = false;
const DEBOUNCE_DELAY = 300;

const generateFakeSugegstion = (textBeforeCursor: string): string | null => {
    const trimmed = textBeforeCursor.trimEnd();

    if(trimmed.endsWith("const")) return "myVariable =";
    if(trimmed.endsWith("function")) return "myFunction()";
    if(trimmed.endsWith("console.")) return "log()";
    if(trimmed.endsWith("return")) return "null";

    return null;
};

const createDebouncePlugin = (fileName: string) => {
    return ViewPlugin.fromClass(
        class{
            constructor(view: EditorView){
                this.triggerSuggestion(view);
            }

            update(update: ViewUpdate){
                if(update.docChanged || update.selectionSet){
                    this.triggerSuggestion(update.view);
                }
            }

            triggerSuggestion(view: EditorView){
                if(debounceTimer !== null){
                    clearTimeout(debounceTimer);
                }

                isWaitingForSuggestion = true;

                debounceTimer = window.setTimeout(async() => {
                    //Fake suggestion(to be deleted in later stages)
                    const cursor = view.state.selection.main.head;
                    const line = view.state.doc.lineAt(cursor);

                    const textBeforeCursor = line.text.slice(0, cursor - line.from);
                    const suggestion = generateFakeSugegstion(textBeforeCursor);

                    isWaitingForSuggestion= false;

                    view.dispatch({
                        effects: setSuggestionEffect.of(suggestion)
                    })
                }, DEBOUNCE_DELAY)
            }

            destroy() {
                if(debounceTimer !== null){
                    clearTimeout(debounceTimer)
                }
            }
        }
    )
}






const renderPlugin = ViewPlugin.fromClass(
    class{
        decorations: DecorationSet;

        constructor(view: EditorView){
            this.decorations = this.build(view  )
        }

        update(update: ViewUpdate){
            //This functions rebuilds the decorations if doc changed, cursor moved pr suggestion changed

            const suggestionChanged = update.transactions.some((transaction) => 
            {
                return transaction.effects.some((effect) => {
                    return effect.is(setSuggestionEffect)
                });
            });

            const shouldRebuild = update.docChanged || update.selectionSet || suggestionChanged;

            if(shouldRebuild){
                this.decorations = this.build(update.view)
            }

        }

        build(view: EditorView){

            if(isWaitingForSuggestion){
                return Decoration.none;
            }


            const suggestion = view.state.field(suggestionState);
            if(!suggestion){
                return Decoration.none
            }

            //Create a widget decor at the cursor position
            const cursor = view.state.selection.main.head;
            return Decoration.set([
                Decoration.widget({
                    widget: new SuggestionWidget(suggestion),
                    side: 1 //Render after the cursor
                }).range(cursor)
            ])
        }
    },
    {
        decorations: (plugin) => plugin.decorations
    }
)

const acceptSuggestionsKeymap = keymap.of([
    {
        key: "Tab",
        run: (view) => {
            const suggestion = view.state.field(suggestionState);

            if(!suggestion){
                return false
            }

            const cursor = view.state.selection.main.head;

            view.dispatch({
                changes: {from: cursor, insert: suggestion}, //Insert the suggestion text
                selection: {anchor: cursor + suggestion.length}, //Move the cursor upto the end of the suggestion

                effects: setSuggestionEffect.of(null),
            })

            return true;
        }
    }
])

export const suggestion = (fileName: string) => [
    suggestionState, //state storage
    createDebouncePlugin(fileName), //Trigger suggestions on typing
    renderPlugin, //render the ghost suggestions
    acceptSuggestionsKeymap, //TAB key to accept it
]