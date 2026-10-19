import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PILOT_DISTRICT } from "@/data/catalog";
import {
  createSeedPosts,
  seedInterests,
  seedNeighbors,
} from "@/data/seed";
import { SEED_IMAGES_VERSION } from "@/data/seedImages";
import type { LocationDetectionStatus } from "@/lib/location";
import type {
  CurrentUserProfile,
  Neighbor,
  Post,
  PostType,
} from "@/lib/types";

interface PrototypeState {
  neighbors: Neighbor[];
  posts: Post[];
  interests: Record<string, string[]>;
  chosenRecipient: Record<string, string>;
  currentUserId: string;
  profile: CurrentUserProfile | null;
  onboardingComplete: boolean;
  rulesAccepted: boolean;
  feedType: PostType;
  feedCategory: string | null;
  toastMessage: string | null;
  savedPostIds: string[];
  ravesCount: number;
  suggestedDistrict: string | null;
  suggestedFirstName: string | null;
  locationDetectStatus: LocationDetectionStatus;
  locationDetectMessage: string | null;
  setLocationDetection: (input: {
    status: LocationDetectionStatus;
    district?: string | null;
    message?: string | null;
    firstName?: string | null;
  }) => void;
  clearLocationDetection: () => void;
  setProfile: (profile: CurrentUserProfile) => void;
  updateProfile: (patch: Partial<CurrentUserProfile>) => void;
  completeOnboarding: () => void;
  acceptRules: () => void;
  setFeedType: (type: PostType) => void;
  setFeedCategory: (category: string | null) => void;
  setCurrentUserId: (id: string) => void;
  expressInterest: (postId: string) => void;
  chooseRecipient: (postId: string, neighborId: string) => void;
  markGiven: (postId: string) => void;
  createPost: (input: Omit<Post, "id" | "status" | "createdAt" | "authorId" | "district">) => void;
  resetDemo: () => void;
  signOut: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  toggleSavedPost: (postId: string) => void;
  getNeighbor: (id: string) => Neighbor | undefined;
  getCurrentNeighbor: () => Neighbor | null;
}

export const DEMO_USER_ID = "demo-user";

export const defaultProfile: CurrentUserProfile = {
  firstName: "Mica",
  phone: "51900000001",
  district: PILOT_DISTRICT,
  memberSince: "2026-07-01T00:00:00.000Z",
};

function buildInitialState() {
  return {
    neighbors: seedNeighbors,
    posts: createSeedPosts(),
    interests: { ...seedInterests },
    chosenRecipient: {} as Record<string, string>,
  };
}

const SEED_POST_IDS = new Set(createSeedPosts().map((p) => p.id));

function mergeSeedPostImages(posts: Post[]): Post[] {
  const freshById = new Map(createSeedPosts().map((p) => [p.id, p]));
  return posts.map((post) => {
    if (post.type === "pido") {
      return { ...post, imageUrls: [] };
    }
    if (!SEED_POST_IDS.has(post.id)) {
      return post;
    }
    const fresh = freshById.get(post.id);
    return fresh ? { ...post, imageUrls: fresh.imageUrls } : post;
  });
}

/** Keep user posts; refresh all seed posts (district, images, copy) from catalog. */
function syncSeedPostsWithCatalog(posts: Post[]): Post[] {
  const freshList = createSeedPosts();
  const seedIds = new Set(freshList.map((p) => p.id));
  const userPosts = posts.filter((p) => !seedIds.has(p.id));
  const syncedSeed = freshList.map((fresh) => {
    const existing = posts.find((p) => p.id === fresh.id);
    if (existing?.status === "given") {
      return { ...fresh, status: "given" as const };
    }
    return fresh;
  });
  return mergeSeedPostImages([...userPosts, ...syncedSeed]);
}

function normalizeDemoProfile(
  profile: CurrentUserProfile | null,
): CurrentUserProfile | null {
  if (!profile) {
    return null;
  }
  let next = profile;
  if (profile.firstName === "Dev") {
    next = { ...next, firstName: "Mica" };
  }
  if (!next.memberSince) {
    next = { ...next, memberSince: defaultProfile.memberSince };
  }
  return next;
}

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),
      currentUserId: "demo-user",
      profile: null,
      onboardingComplete: false,
      rulesAccepted: false,
      feedType: "regalo",
      feedCategory: null,
      toastMessage: null,
      savedPostIds: [],
      ravesCount: 0,
      suggestedDistrict: null,
      suggestedFirstName: null,
      locationDetectStatus: "idle",
      locationDetectMessage: null,

      setLocationDetection: ({
        status,
        district = null,
        message = null,
        firstName = null,
      }) =>
        set({
          locationDetectStatus: status,
          suggestedDistrict: district,
          locationDetectMessage: message,
          suggestedFirstName: firstName,
        }),

      clearLocationDetection: () =>
        set({
          suggestedDistrict: null,
          suggestedFirstName: null,
          locationDetectStatus: "idle",
          locationDetectMessage: null,
        }),

      setProfile: (profile) =>
        set({
          profile: {
            ...profile,
            memberSince: profile.memberSince ?? new Date().toISOString(),
            avatarColor: profile.avatarColor ?? "#2d6a4f",
          },
        }),

      updateProfile: (patch) => {
        const current = get().profile ?? defaultProfile;
        set({
          profile: {
            ...current,
            ...patch,
            firstName: patch.firstName?.trim() || current.firstName,
            memberSince: current.memberSince ?? defaultProfile.memberSince,
            avatarColor: patch.avatarColor ?? current.avatarColor ?? "#2d6a4f",
          },
        });
      },

      completeOnboarding: () => set({ onboardingComplete: true }),

      acceptRules: () => set({ rulesAccepted: true }),

      setFeedType: (feedType) => set({ feedType, feedCategory: null }),

      setFeedCategory: (feedCategory) => set({ feedCategory }),

      setCurrentUserId: (currentUserId) => set({ currentUserId }),

      expressInterest: (postId) => {
        const state = get();
        const post = state.posts.find((p) => p.id === postId);
        if (!post || post.status !== "active") {
          return;
        }
        const userId = state.currentUserId;
        if (post.authorId === userId) {
          return;
        }
        const existing = state.interests[postId] ?? [];
        if (existing.includes(userId)) {
          state.showToast(
            post.type === "pido"
              ? "Ya dijiste que tienes esto."
              : "Ya mostraste interés en esta publicación.",
          );
          return;
        }
        set({
          interests: {
            ...state.interests,
            [postId]: [...existing, userId],
          },
        });
        if (post.type !== "pido") {
          state.showToast("Listo — el vecino verá tu interés (sin tu número).");
        }
      },

      chooseRecipient: (postId, neighborId) => {
        set((state) => ({
          chosenRecipient: {
            ...state.chosenRecipient,
            [postId]: neighborId,
          },
        }));
      },

      markGiven: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, status: "given" as const } : p,
          ),
        }));
        get().showToast("Gracias — la publicación ya no aparece en el feed.");
      },

      createPost: (input) => {
        const state = get();
        const profile = state.profile ?? defaultProfile;
        const post: Post = {
          id: `p-${Date.now()}`,
          status: "active",
          authorId: state.currentUserId,
          district: profile.district,
          createdAt: new Date().toISOString(),
          ...input,
        };
        set({ posts: [post, ...state.posts], feedType: input.type });
      },

      resetDemo: () => {
        set({
          ...buildInitialState(),
          currentUserId: DEMO_USER_ID,
          toastMessage: null,
          savedPostIds: [],
          ravesCount: 0,
          feedType: "regalo",
          feedCategory: null,
          suggestedDistrict: null,
          suggestedFirstName: null,
          locationDetectStatus: "idle",
          locationDetectMessage: null,
        });
      },

      signOut: () => {
        set({
          profile: null,
          onboardingComplete: false,
          rulesAccepted: false,
          toastMessage: null,
        });
      },

      toggleSavedPost: (postId) => {
        const state = get();
        const post = state.posts.find((p) => p.id === postId);
        if (!post || post.authorId === state.currentUserId) {
          return;
        }
        const saved = state.savedPostIds.includes(postId);
        set({
          savedPostIds: saved
            ? state.savedPostIds.filter((id) => id !== postId)
            : [postId, ...state.savedPostIds],
        });
        state.showToast(
          saved ? "Quitado de Guardados." : "Guardado — lo ves en tu perfil.",
        );
      },

      showToast: (toastMessage) => {
        set({ toastMessage });
        window.setTimeout(() => {
          const current = get().toastMessage;
          if (current === toastMessage) {
            set({ toastMessage: null });
          }
        }, 3200);
      },

      clearToast: () => set({ toastMessage: null }),

      getNeighbor: (id) => {
        if (id === "demo-user") {
          const profile = get().profile ?? defaultProfile;
          return {
            id: "demo-user",
            firstName: profile.firstName,
            phone: profile.phone,
            district: profile.district,
            avatarColor: profile.avatarColor ?? "#2d6a4f",
            avatarImageUrl: profile.avatarImageUrl,
          };
        }
        return get().neighbors.find((n) => n.id === id);
      },

      getCurrentNeighbor: () => get().getNeighbor(get().currentUserId) ?? null,
    }),
    {
      name: "barrio-mvp-buynothing",
      version: SEED_IMAGES_VERSION,
      migrate: (persisted, version) => {
        type Persisted = {
          posts: Post[];
          interests: Record<string, string[]>;
          chosenRecipient: Record<string, string>;
          currentUserId: string;
          profile: CurrentUserProfile | null;
          onboardingComplete: boolean;
          rulesAccepted: boolean;
          feedType: PostType;
          savedPostIds?: string[];
          ravesCount?: number;
        };
        let state = persisted as Persisted;
        if (version < SEED_IMAGES_VERSION && Array.isArray(state.posts)) {
          state = {
            ...state,
            posts: syncSeedPostsWithCatalog(state.posts),
          };
        }
        return {
          ...state,
          currentUserId: DEMO_USER_ID,
          profile: normalizeDemoProfile(state.profile),
          savedPostIds: state.savedPostIds ?? [],
          ravesCount: state.ravesCount ?? 0,
        };
      },
      partialize: (state) => ({
        posts: state.posts,
        interests: state.interests,
        chosenRecipient: state.chosenRecipient,
        currentUserId: state.currentUserId,
        profile: state.profile,
        onboardingComplete: state.onboardingComplete,
        rulesAccepted: state.rulesAccepted,
        feedType: state.feedType,
        savedPostIds: state.savedPostIds,
        ravesCount: state.ravesCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const normalized = normalizeDemoProfile(state.profile);
        if (normalized !== state.profile) {
          state.profile = normalized;
        }
        if (Array.isArray(state.posts)) {
          state.posts = syncSeedPostsWithCatalog(state.posts);
        }
      },
    },
  ),
);
