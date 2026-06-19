import localFont from "next/font/local";

export const timSans = localFont({
  src: [
    {
      path: "./TIMSans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./TIM Sans.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./TIMSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./TIM Sans Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-tim-sans",
});
