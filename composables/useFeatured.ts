import { useAsyncData, type AsyncData } from "nuxt/app";
import type ListingContent from "~/types/Listing";

export function useFeatured(): AsyncData<ListingContent, Error | null> {
  return useAsyncData("featured-listing", () =>
    queryContent("/category").where({ _extension: "md", featured: true }).findOne()
  );
}
