import React from "react";
import { Button } from "../ui/button";
import { PostWithComments } from "./post-with-comments";
import { Users, ArrowRight } from "lucide-react";
import { CategoryBadge } from "../CategoryBadge";
import { InputSearch } from "../ui/input-search";
import { BaseCard } from "./base-card";
import { Reveal } from "../Reveal";
import { Separator } from "../ui/separator";
import Link from "next/link";

export interface TopicCardProps {
  title: string;
  description: string;
  isFollowing?: boolean;
  followersIncrease?: number;
  posts: any[]; // Aceita estrutura flexível para PostWithComments
  relatedTopics?: {
    id: string;
    name: string;
    isFollowing?: boolean;
  }[];
  onFollow?: () => void;
  onSearch?: (query: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  description,
  isFollowing = false,
  followersIncrease,
  posts,
  relatedTopics = [],
  onFollow,
  onSearch,
  onViewAll,
  className,
}) => {
  return (
    <Reveal>
      <BaseCard>
        <React.Fragment>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between gap-2 w-full flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <CategoryBadge title="Papers" color="bg-primary" variant="outline" />
                <CategoryBadge title="Followers" color="bg-primary" variant="outline" />
              </div>
              <Button variant={isFollowing ? "outline" : "default"} size="default" className="gap-2" onClick={onFollow}>
                {isFollowing ? "Seguindo" : "Follow"}
                {followersIncrease && <span className="opacity-80">| {followersIncrease}</span>}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <h2 className="heading-02-bold text-foreground">{title}</h2>
            <p className="body-paragraph text-muted-foreground">{description}</p>
          </div>

          <InputSearch placeholder="Insira um termo para buscar" />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`${relatedTopics.length > 0 ? "flex-1 flex flex-col" : "grid grid-cols-2"} w-full gap-4`}>
              {posts.map((post, index) => (
                <PostWithComments
                  key={index}
                  badges={post.badges || []}
                  title={post.title}
                  descriptions={post.descriptions}
                  author={post.author || (post.persons?.[0]) || { name: "Autor", imageUrl: "" }}
                  date={post.date}
                  link={post.link}
                  viewCount={post.viewCount}
                  className={post.className}
                  image={post.image}
                  comments={post.comments || []}
                  sharedBy={post.sharedBy}
                />
              ))}
            </div>

            {relatedTopics.length > 0 && (
              <div className="lg:w-80 flex flex-col gap-4">
                <h3 className="body-title-medium text-foreground">Related Topics</h3>
                <div className="flex flex-col gap-2">
                  {relatedTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted-surface/30 hover:bg-muted-surface/50 transition-colors"
                    >
                      <Link className="body-paragraph-medium flex-1" href={`/topics/${topic.id}`}>
                        {topic.name}
                      </Link>
                      <Button variant="ghost" size="sm" className="gap-1.5 h-8">
                        <Users className="size-3.5" />
                        {topic.isFollowing ? "Seguindo" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          <Button variant="link" className="gap-2 mx-auto" onClick={onViewAll}>
            Visualizar todos os artigos
            <ArrowRight className="size-4" />
          </Button>
        </React.Fragment>
      </BaseCard>
    </Reveal>
  );
};
