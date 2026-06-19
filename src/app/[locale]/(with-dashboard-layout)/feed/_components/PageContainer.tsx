"use client";

import { PageBoxLayout } from "@/components/layout/page-box";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor";
import { BaseCard } from "@/components/cards/base-card";
import { Reveal } from "@/components/Reveal";
import React from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { mockTopics } from "@/mockdata";
import { PostWithComments } from "@/components/cards/post-with-comments";
import { Separator } from "@/components/ui/separator";
import { InputSearch } from "@/components/ui/input-search";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const PageContainer = () => {
  const allTopics = mockTopics;

  return (
    <PageBoxLayout breadcrumbs={<PageBreadcrumbs />} ignoreIcon>
      <div className="flex flex-col gap-6 items-center justify-center w-full max-w-[1170px] mx-auto">
        {/* Primeiro bloco: editor */}
        <Reveal width="100%">
          <BaseCard>
            <React.Fragment>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-2 flex-wrap">
                  <CategoryBadge title="Papers" color="bg-warning" variant="outline" />
                  <CategoryBadge title="Followers" color="bg-info" variant="outline" />
                </div>
                <h2 className="heading-02-bold text-foreground">Compartilhe com a gente</h2>
                <p className="body-paragraph text-muted-foreground">
                  Escreva pra gente e deixe a comunidade ouvir você.
                </p>
              </div>
              <RichTextEditorDemo className="w-full" />

              <Separator />

              <div className="flex flex-col gap-2">
                <h2 className="heading-03-bold text-foreground">Publicações recentes</h2>
                <p className="body-paragraph text-muted-foreground">
                  Escreva pra gente e deixe a comunidade ouvir você.
                </p>
                <div className="flex gap-2">
                  <InputSearch placeholder="Digite um título para iniciar uma busca" />
                  <Button variant="outlinePrimary" className="mr-1" icon={Filter}>
                    Pesquisar
                  </Button>
                  <Button variant="outline" icon={Filter}>
                    Filtar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 ">
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
      </div>
    </PageBoxLayout>
  );
};
