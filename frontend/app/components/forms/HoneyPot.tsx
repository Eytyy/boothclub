import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function Honeypot<T extends FieldValues = FieldValues>({
  register,
}: {
  register: UseFormRegister<T>;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
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
