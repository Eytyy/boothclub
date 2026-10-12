import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function Honeypot<T extends FieldValues = FieldValues>({
  register,
}: {
  register: UseFormRegister<T>;
}) {
  return (
    <div
      // Clipped in place rather than pushed off-screen: a -9999px offset
      // becomes 9999px of sideways scroll in right-to-left pages.
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website" as Path<T>)}
      />
    </div>
  );
}
