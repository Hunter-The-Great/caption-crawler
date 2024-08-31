import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { RouterOutput, trpc } from "~/internal/trpc";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

type JobResponse = RouterOutput["playlistQueue"]["jobStatus"];

export const Route = createFileRoute("/search/$collection")({
  loader: async ({ params, deps, context }) => {
    await context.trpc.metadata.getMetadataFromCollection.ensureData({
      collectionId: params.collection,
    });
    await context.trpc.collections.getCollection.ensureData({
      collectionId: params.collection,
    });
    return {
      collectionId: params.collection,
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const loaderData = Route.useLoaderData();
  const [metadata] = trpc.metadata.getMetadataFromCollection.useSuspenseQuery({
    collectionId: loaderData.collectionId,
  });
  const [collection] = trpc.collections.getCollection.useSuspenseQuery({
    collectionId: loaderData.collectionId,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const timeSince = formatDistanceToNow(collection.createdAt);

  const { data: searchData, status } = trpc.search.search.useQuery(
    {
      collection: loaderData.collectionId,
      query: searchQuery,
    },
    {
      enabled: searchQuery.length > 0,
    }
  );

  return (
    <div className="flex flex-col pt-10 items-center">
      {metadata.thumbnailUrl && (
        <img
          src={metadata.thumbnailUrl}
          className="w-[70vw] max-w-[400px] object-cover shadow-flat rounded-lg aspect-video"
        />
      )}
      <div className="h-5" />
      <div className="text-navy font-bold text-[20px]">{metadata.title}</div>
      <div className="font-medium text-[13px] opacity-50">
        Last updated: {timeSince} ago
      </div>
      <div className="h-3" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border-2 border-tan-200 text-[14px] placeholder:text-[#939393] w-full max-w-[316px]"
        placeholder="Search Transcripts..."
      />
      {searchData?.hits && (
        <div className="w-full max-w-[600px] mt-4 space-y-4">
          {searchData.hits.map((hit) => (
            <div
              key={hit.document.id}
              className="bg-white rounded-lg shadow-md p-4 flex"
            >
              <div className="w-40 h-24 flex-shrink-0 mr-4">
                <img
                  src={hit.document.thumbnailUrl}
                  alt={hit.document.videoTitle}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-navy font-bold text-[18px] mb-2 truncate">
                  {hit.document.videoTitle}
                </div>
                <div className="text-[14px] text-gray-700 mb-2">
                  {hit.document.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
