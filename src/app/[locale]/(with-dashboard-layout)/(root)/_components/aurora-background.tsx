"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants, LinkButton } from "@/components/ui/button";
import { User } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdFeed } from "react-icons/md";

export function AuroraBackgroundMainRoot() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Extrai o locale do pathname (ex: /pt/... ou /en/...)
  const locale = pathname?.split("/")[1] || "pt";
  const authPath = `/${locale}/auth`;

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-start justify-center px-7 w-full max-w-[1700px] mx-auto"
      >
        <Badge variant={"outline"} className="flex gap-2 items-center">
          <Image
            src={"/img/LUMIABRANCA.png"}
            alt={"Logo da Lumen"}
            aria-label={"Logo da Lumen"}
            width={12}
            height={12}
          />
          Rede colaborativa sobre demência
        </Badge>
        <div className="heading-03-bold lg:display-01 text-start dark:text-white max-lg:mt-4">Comunidade Lumen</div>
        <div className="text-start dark:text-neutral-200">
          A Comunidade Lumen é um espaço dedicado à troca de conhecimento, experiências e apoio entre profissionais,
          familiares e pessoas interessadas em demência. Junte-se a nós para compartilhar informações, artigos, eventos
          e fortalecer a rede de cuidado e conscientização sobre demências no Brasil.
        </div>

        <div className="flex gap-4 items-center mt-5">
          {session?.user ? (
            <LinkButton variant={"outline"} icon={User} href={`/${locale}/user/${session.user.id}`}>
              Meu perfil
            </LinkButton>
          ) : (
            <LinkButton icon={User} href={authPath}>
              Entrar na comunidade
            </LinkButton>
          )}
          <LinkButton variant={"outline"} icon={MdFeed} href={`/${locale}/feed`}>
            Acessar Feed
          </LinkButton>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
