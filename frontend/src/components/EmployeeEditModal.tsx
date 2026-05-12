import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Employee, Inputs } from "./Employees";
import type { Role } from "./EmployeeAdd";
import "./EmployeeAdd.css";
import "./Employees.css";

function toInputDate(value: Date | string | null | undefined): string {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value.slice(0, 10);
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export type EditEmployeeModalProps = {
  /** When true, the modal is shown (e.g. tied to your `edit` state). */
  open: boolean;
  /** Employee row being edited; when null, modal content is not rendered. */
  employee: Employee | null;
  /** Role options — same shape as `EmployeeAdd` (from `get-roles/`). */
  roles: Role[];
  onClose: () => void;
  /** Called with form values on submit; wire to your API when ready. */
  onSubmit?: SubmitHandler<Inputs>;
};

/**
 * Modal + form aligned with `EmployeeAdd`: rate, role, dates.
 * Employee is read-only; `employee` username is kept in a hidden field.
 */
export function EditEmployeeModal({
  open,
  employee,
  roles,
  onClose,
  onSubmit,
}: EditEmployeeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (!open || !employee) return;
    reset({
      employee: employee.emp_uname,
      rate: employee.rate,
      role: employee.role,
      role_started: toInputDate(employee.role_started as Date | string),
      role_ended: toInputDate(employee.role_ended as Date | string | null) || undefined,
    });
  }, [open, employee, reset]);

  if (!open || !employee) return null;

  const submit: SubmitHandler<Inputs> = (data) => {
    onSubmit?.(data);
  };

  return (
    <div
      className="employees-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-edit-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="employees-modal">
        <button
          type="button"
          className="employees-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="employee-add__card">
          <header className="employee-add__header">
            <h1 id="employee-edit-modal-title" className="employee-add__title">
              Edit employee role
            </h1>
            <p className="employee-add__subtitle">
              Update role details for{" "}
              <strong>
                {employee.emp_fname} {employee.emp_lname}
              </strong>{" "}
              ({employee.emp_uname}).
            </p>
          </header>

          <form
            className="employee-add__form"
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            <input type="hidden" {...register("employee")} />
            <input type="hidden" {...register("id")} value={employee.id} />

            <div className="employee-add__field">
              <span className="employee-add__label">Employee</span>
              <div className="employees-modal__readonly">
                {employee.emp_fname} {employee.emp_lname} ({employee.emp_uname})
              </div>
            </div>

            <div className="employee-add__field">
              <label className="employee-add__label" htmlFor="edit-emp-rate">
                Hourly rate ($) <span className="employee-add__required">*</span>
              </label>
              <input
                id="edit-emp-rate"
                className="employee-add__input"
                type="number"
                min={0}
                step={0.01}
                autoComplete="off"
                {...register("rate", {
                  required: "Hourly rate is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Rate must be zero or greater" },
                })}
              />
              {errors.rate && (
                <span className="employee-add__error">{errors.rate.message}</span>
              )}
            </div>

            <div className="employee-add__field">
              <label className="employee-add__label" htmlFor="edit-emp-role">
                Role <span className="employee-add__required">*</span>
              </label>
              <select
                id="edit-emp-role"
                className="employee-add__select"
                {...register("role", { required: "Please select a role" })}
              >
                {roles.map((r) => (
                  <option value={r.role} key={r.role}>
                    {r.title}
                  </option>
                ))}
              </select>
              {errors.role && (
                <span className="employee-add__error">{errors.role.message}</span>
              )}
            </div>

            <div className="employee-add__row">
              <div className="employee-add__field">
                <label
                  className="employee-add__label"
                  htmlFor="edit-emp-role_started"
                >
                  Role start date{" "}
                  <span className="employee-add__required">*</span>
                </label>
                <input
                  id="edit-emp-role_started"
                  className="employee-add__input"
                  type="date"
                  {...register("role_started", {
                    required: "Start date is required",
                  })}
                />
                {errors.role_started && (
                  <span className="employee-add__error">
                    {errors.role_started.message}
                  </span>
                )}
              </div>

              <div className="employee-add__field">
                <label
                  className="employee-add__label"
                  htmlFor="edit-emp-role_ended"
                >
                  Role end date
                </label>
                <input
                  id="edit-emp-role_ended"
                  className="employee-add__input"
                  type="date"
                  autoComplete="off"
                  {...register("role_ended")}
                />
                <span className="employee-add__hint">
                  Optional — leave blank if ongoing
                </span>
              </div>
            </div>

            <div className="employees-modal__actions">
              <button
                type="button"
                className="employee-add__submit"
                style={{ background: "#64748b", boxShadow: "none" }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="employee-add__submit">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
