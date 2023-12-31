import { Transform, Step } from "prosemirror-transform";
import removeDuplicates from "./removeDuplicates";

export type ChangedRange = {
  oldStart: number;
  oldEnd: number;
  newStart: number;
  newEnd: number;
};

/**
 * Removes duplicated ranges and ranges that are
 * fully captured by other ranges.
 */
function simplifyChangedRanges(changes: ChangedRange[]): ChangedRange[] {
  const uniqueChanges = removeDuplicates(changes);

  return uniqueChanges.length === 1
    ? uniqueChanges
    : uniqueChanges.filter((change, index) => {
        const rest = uniqueChanges.filter((_, i) => i !== index);

        return !rest.some((otherChange) => {
          return (
            change.oldStart >= otherChange.oldStart &&
            change.oldEnd <= otherChange.oldEnd &&
            change.newStart >= otherChange.newStart &&
            change.newEnd <= otherChange.newEnd
          );
        });
      });
}

/**
 * Returns a list of changed ranges
 * based on the first and last state of all steps.
 */
export default function getChangedRanges(transform: Transform): ChangedRange[] {
  const { mapping, steps } = transform;
  const changes: ChangedRange[] = [];

  mapping.maps.forEach((stepMap, index) => {
    // This accounts for step changes where no range was actually altered
    // e.g. when setting a mark, node attribute, etc.
    // @ts-ignore
    if (!stepMap.ranges.length) {
      const step = steps[index] as Step & {
        from?: number;
        to?: number;
      };

      if (step.from === undefined || step.to === undefined) {
        return;
      }

      changes.push({
        oldStart: step.from,
        oldEnd: step.to,
        newStart: step.from,
        newEnd: step.to,
      });
    } else {
      stepMap.forEach((from, to) => {
        const newStart = mapping.slice(index).map(from, -1);
        const newEnd = mapping.slice(index).map(to);
        const oldStart = mapping.invert().map(newStart, -1);
        const oldEnd = mapping.invert().map(newEnd);

        changes.push({
          oldStart,
          oldEnd,
          newStart,
          newEnd,
        });
      });
    }
  });

  return simplifyChangedRanges(changes);
}
