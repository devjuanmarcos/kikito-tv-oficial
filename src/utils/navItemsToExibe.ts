"use client";
import { Session } from "next-auth";

export const classNavItems = (session: Session) => {
  const classItems = session?.user?.class ?? [];

  return classItems.map((item) => ({
    title: `- ${item.name}`,
    url: `/pt/dashboard/${item.id}`,
    icon: "dashboard" as any,
    isActive: false,
    items: [],
  }));
};

export const eventsNavItems = (session: Session) => {
  const events = session?.user?.class ?? [];

  return events.map((event) => ({
    title: `- ${event.name}`,
    url: `/pt/dashboard/${event.id}/professores/calendario`,
    icon: "dashboard" as any,
    isActive: false,
    items: [],
  }));
};

export const subjectsNavItems = (session: Session) => {
  const subjects = session?.user?.subjects ?? [];
  const role = session?.user?.role;
  return subjects.map((subject) => {
    const url = role.includes("teacher")
      ? `/pt/dashboard/${session?.user.class}/professores/materias/${subject.id}/aulas`
      : `/pt/dashboard/${session?.user.studentInfos?.class?.id as string}/alunas/materias/${subject.id}/aulas`;

    return {
      title: `- ${subject.name}`,
      url: url,
      icon: "dashboard" as any,
      isActive: false,
      items: [],
    };
  });
};
