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
        return "//Implement";
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

export const suggestion = (fileName: string) => [
    suggestionState, //state storage
    renderPlugin, //render the ghost suggestions
]