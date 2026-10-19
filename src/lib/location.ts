import { districts, PILOT_DISTRICT } from "@/data/catalog";

export type LocationDetectionStatus =
  | "idle"
  | "detecting"
  | "found"
  | "denied"
  | "unavailable"
  | "unsupported";

export interface LocationDetectionResult {
  status: Exclude<LocationDetectionStatus, "idle" | "detecting">;
  district: string | null;
  message: string;
}

/** Approximate bounds for Lima distritos (prototype — not survey-grade). */
const districtBounds: Record<
  (typeof districts)[number],
  { minLat: number; maxLat: number; minLng: number; maxLng: number }
> = {
  Miraflores: { minLat: -12.135, maxLat: -12.078, minLng: -77.055, maxLng: -77.012 },
  "San Isidro": { minLat: -12.118, maxLat: -12.068, minLng: -77.045, maxLng: -77.008 },
  "Santiago de Surco": { minLat: -12.165, maxLat: -12.095, minLng: -77.02, maxLng: -76.975 },
  Barranco: { minLat: -12.165, maxLat: -12.128, minLng: -77.03, maxLng: -77.002 },
};

export function districtFromCoordinates(
  latitude: number,
  longitude: number,
): (typeof districts)[number] | null {
  for (const name of districts) {
    const b = districtBounds[name];
    if (
      latitude >= b.minLat &&
      latitude <= b.maxLat &&
      longitude >= b.minLng &&
      longitude <= b.maxLng
    ) {
      return name;
    }
  }
  return null;
}

export function hasListingDataForDistrict(district: string): boolean {
  return district === PILOT_DISTRICT;
}

/** Demo splash: pretend to locate the user, then resolve to seed distrito. */
export const DEMO_LOCATION_DETECT_MS = 4000;

export function getDemoLocationFoundResult(): LocationDetectionResult {
  return {
    status: "found",
    district: PILOT_DISTRICT,
    message: "Hay publicaciones de vecinos cerca de ti.",
  };
}

export function detectUserDistrict(): Promise<LocationDetectionResult> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve({
      status: "unsupported",
      district: null,
      message: "Tu navegador no puede usar ubicación. Busca tu distrito en el siguiente paso.",
    });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const district = districtFromCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (!district) {
          resolve({
            status: "unavailable",
            district: null,
            message:
              "No ubicamos un distrito de Lima cerca. Busca el tuyo para ver qué hay disponible.",
          });
          return;
        }
        if (hasListingDataForDistrict(district)) {
          resolve({
            status: "found",
            district,
            message: `Estás cerca de ${district} — hay publicaciones de vecinos para ti.`,
          });
          return;
        }
        resolve({
          status: "found",
          district,
          message: `Te ubicamos en ${district}. Aún no hay publicaciones aquí; puedes ser el primero en publicar.`,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            status: "denied",
            district: null,
            message:
              "Sin permiso de ubicación. Busca tu distrito para ver lo disponible cerca.",
          });
          return;
        }
        resolve({
          status: "unavailable",
          district: null,
          message: "No pudimos detectar tu ubicación. Busca tu distrito a mano.",
        });
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  });
}
