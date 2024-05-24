export interface pessoas {
  id: number;
  name: string;
  nascimento: Date;
}

export interface produtos {
  id: number;
  produto: string;
  price: string;
}

interface casa {
  pessoa: pessoas[];
}

export interface store {
  produtos: pessoas;
}
