import { useEffect, useId, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { DistrictSearch } from "@/components/DistrictSearch";
import { districts } from "@/data/catalog";
import type { CurrentUserProfile } from "@/lib/types";

const avatarColors = [
  "#2d6a4f",
  "#40916c",
  "#1d3557",
  "#bc6c25",
  "#6d597a",
  "#e76f51",
] as const;

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

type ProfileEditSheetProps = {
  open: boolean;
  profile: CurrentUserProfile;
  onClose: () => void;
  onSave: (patch: Partial<CurrentUserProfile>) => void;
  onError: (message: string) => void;
};

export function ProfileEditSheet({
  open,
  profile,
  onClose,
  onSave,
  onError,
}: ProfileEditSheetProps) {
  const photoInputId = useId();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [district, setDistrict] = useState(profile.district);
  const [avatarColor, setAvatarColor] = useState(
    profile.avatarColor ?? "#2d6a4f",
  );
  const [avatarImageUrl, setAvatarImageUrl] = useState(
    profile.avatarImageUrl ?? "",
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    setFirstName(profile.firstName);
    setDistrict(profile.district);
    setAvatarColor(profile.avatarColor ?? "#2d6a4f");
    setAvatarImageUrl(profile.avatarImageUrl ?? "");
  }, [open, profile]);

  if (!open) {
    return null;
  }

  const onPickPhoto = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      onError("Elige una imagen (JPG, PNG, etc.).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      onError("La foto debe pesar menos de 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarImageUrl(reader.result);
      }
    };
    reader.onerror = () => onError("No pudimos leer la foto. Intenta otra.");
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const trimmed = firstName.trim();
    if (!trimmed) {
      onError("Escribe tu nombre.");
      return;
    }
    const validDistrict = districts.find((d) => d === district);
    if (!validDistrict) {
      onError("Elige un distrito de la lista.");
      return;
    }
    onSave({
      firstName: trimmed,
      district: validDistrict,
      avatarColor,
      avatarImageUrl: avatarImageUrl || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <div className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-2xl bg-white p-5 text-ink shadow-xl ring-1 ring-border">
        <div className="flex items-center justify-between gap-2">
          <h2 id="profile-edit-title" className="text-lg font-bold text-ink">
            Editar perfil
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Avatar
            name={firstName || profile.firstName}
            color={avatarColor}
            size="lg"
            imageUrl={avatarImageUrl || undefined}
          />
          <label
            htmlFor={photoInputId}
            className="cursor-pointer rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand"
          >
            Cambiar foto
          </label>
          <input
            id={photoInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onPickPhoto(e.target.files?.[0])}
          />
          {avatarImageUrl ? (
            <button
              type="button"
              className="text-xs font-medium text-ink-muted underline"
              onClick={() => setAvatarImageUrl("")}
            >
              Quitar foto
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Nombre</span>
            <input
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3 text-base text-ink outline-none ring-brand focus:ring-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </label>

          <DistrictSearch value={district} onChange={setDistrict} />

          <div>
            <p className="text-sm font-medium text-ink">Color del avatar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Color ${color}`}
                  onClick={() => setAvatarColor(color)}
                  className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ${
                    avatarColor === color ? "ring-brand" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl py-3 text-sm font-semibold text-ink-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-brand py-3 text-sm font-semibold text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
