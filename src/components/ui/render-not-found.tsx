interface Render404Props {
  message?: string;
}

export const Render404 = ({ message }: Render404Props) => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="relative">
      <h1 className="text-[5rem] font-black text-destructive opacity-20 leading-none select-none md:text-[10rem]">
        404
      </h1>
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="heading-03-bold text-destructive">Nenhuma informação encontrada</h2>
      </div>
    </div>
    <p className="mt-8 body-paragraph ">
      {message || "Desculpe, não conseguimos encontrar o que você está procurando."}
    </p>
    <div className="my-12 relative w-48 h-48">
      <div className="absolute inset-0 bg-destructive rounded-lg rotate-12 opacity-20"></div>
      <div className="absolute inset-4 bg-destructive rounded-lg -rotate-12 opacity-40"></div>
      <div className="absolute inset-8 flex items-center justify-center">
        <span className="text-7xl">😐</span>
      </div>
    </div>
  </div>
);
