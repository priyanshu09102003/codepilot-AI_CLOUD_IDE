export const BASE_PADDING = 12; //Root level items
export const LEVEL_PADDING = 12; //keep increasing the padding by 12 inside the root level items

export const getItemPadding = (level: number, isFile: boolean) => {
    const fileOffset = isFile ? 16 : 0;
    return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
}