import { BaseCard } from "@/components/cards/base-card";
import { PostWithComments } from "@/components/cards/post-with-comments";
import { Reveal } from "@/components/Reveal";
import { Separator } from "@/components/ui/separator";
import { SimpleTitleIcon } from "@/components/ui/title-icon";
import { mockTopics } from "@/mockdata";
import React from "react";
import { MdPodcasts } from "react-icons/md";

export const UserPosts = () => {
  const allTopics = mockTopics;

  return (
    <Reveal width="100%">
      <BaseCard>
        <React.Fragment>
          <div className="grid grid-cols-1 gap-6 ">
            <div className="body-title-bold leading-none tracking-tight flex items-center gap-4">
              <SimpleTitleIcon icon={MdPodcasts} />
              Publicações do usuário
            </div>
            {(() => {
              // Cria array de todos os posts com referência ao tópico
              const allPosts = allTopics.flatMap((topic) =>
                topic.posts.map((post) => ({ post, topicTitle: topic.title }))
              );
              // Aleatoriza a ordem dos posts
              for (let i = allPosts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
              }
              return allPosts.map(({ post, topicTitle }, idx) => (
                <React.Fragment key={idx}>
                  <PostWithComments
                    badges={[{ title: topicTitle, color: "bg-primary" }]}
                    title={post.title}
                    descriptions={post.description}
                    persons={post.author ? [{ name: post.author.name, imageUrl: post.author.avatar || "" }] : []}
                    date={post.createdAt?.split("T")[0]}
                    link={"#"}
                    viewCount={post.viewsCount}
                    image={
                      "featuredImage" in post && post.featuredImage
                        ? { src: post.featuredImage, alt: post.title }
                        : undefined
                    }
                    comments={(post.comments || []).map((c) => ({
                      ...c,
                      imageUrl: c.imageUrl || "",
                      time: c.time || "",
                    }))}
                  />
                  <Separator />
                </React.Fragment>
              ));
            })()}
          </div>
        </React.Fragment>
      </BaseCard>
    </Reveal>
  );
};
