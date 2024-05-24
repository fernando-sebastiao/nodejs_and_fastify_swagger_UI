export interface pessoa {
  id: number;
  name: string;
  nascimento: Date;
}

export interface produtos {
  id: number;
  produto: string;
  price: number;
}

export interface casa {
  familia: pessoa[];
}

export interface store {
  Banca: produtos[];
}
