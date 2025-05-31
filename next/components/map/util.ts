import {Px, Ratio} from "./types"


function isPx(value: Px | number | undefined ): value is Px {
	if (!value) {
		return false;
	}

  return (
    typeof value === 'string' &&
    /^\d+(\.\d+)?px$/.test(value)
  );
}

export function calculateStrokeWidth(strokeWidth: Px | number | undefined=1, targetRatio: Ratio, originRatio: Ratio) {
	if (isPx(strokeWidth)) {
		strokeWidth = Number.parseFloat(strokeWidth)
	}
	return originRatio.min * strokeWidth / targetRatio.min 
}
