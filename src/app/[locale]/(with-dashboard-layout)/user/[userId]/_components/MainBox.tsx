import { BaseCard } from "@/components/cards/base-card";
import { Reveal } from "@/components/Reveal";
import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import { SendIcon } from "lucide-react";

export const MainBox = () => {
  return (
    <Reveal width="100%">
      <BaseCard className="">
        <React.Fragment>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <div className="relative w-full">
                <Image
                  src={
                    "https://media.licdn.com/dms/image/v2/D4D16AQFRdnUiY-04XA/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1702160206937?e=1771459200&v=beta&t=o1OOKrqfP-WwOw5ddjl7gE8W7VQqktLYn5yLLgYoc5U"
                  }
                  alt="Capa do usuário"
                  width={1200}
                  height={400}
                  className="w-full object-cover aspect-[8/2] rounded-xl"
                />
                <Image
                  src={
                    "https://media.licdn.com/dms/image/v2/D4D03AQHJjQXd6R0vtQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725801415761?e=1771459200&v=beta&t=mp36CFZFm_RMTG6kpIjLFNp9UeFYR4vHdvgFdSzsf44"
                  }
                  alt="Foto de perfil do usuário"
                  width={150}
                  height={150}
                  className="rounded-full absolute left-4 top-1/2 -translate-y-1/2 max-w-[150px] border-primary border-2 shadow-lg bg-background"
                  style={{ zIndex: 2 }}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 mt-2 px-4">
              <span className="heading-05-medium">Juan Marcos de Souza Texe</span>
              <span className="body-paragraph text-muted-foreground">
                Desenvolvedor Full Stack | Next.js, Vue.js/Nuxt.js, Node.js & TypeScript | UI/UX Designer (Figma,
                Illustrator, Photoshop) | Cursando Análise e Desenvolvimento de Sistemas
              </span>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                <span className="body-callout text-muted-foreground">Petrópolis, Rio de Janeiro, Brasil </span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant={"outlinePrimary"} icon={MdAdd}>
                  Começar a seguir
                </Button>
                <Button variant={"outline"} icon={SendIcon}>
                  Compartilhar perfil
                </Button>
              </div>
            </div>
          </div>
        </React.Fragment>
      </BaseCard>
    </Reveal>
  );
};
