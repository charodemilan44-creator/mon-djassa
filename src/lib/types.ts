export type Shop = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  whatsapp: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  color: string;
  hours: string | null;
  accepts_cash: boolean;
  accepts_wave: boolean;
  accepts_orange_money: boolean;
  trial_ends_at: string;
  paid_until: string | null;
  created_at: string;
};

export type Category = { id: string; shop_id: string; name: string; position: number };

export type Product = {
  id: string;
  shop_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  in_stock: boolean;
  position: number;
  created_at: string;
};

export type DeliveryZone = { id: string; shop_id: string; commune: string; fee: number };

export type Payment = {
  id: string;
  plan: "monthly" | "yearly";
  amount: number;
  method: "wave" | "orange_money" | "autre";
  reference: string | null;
  created_at: string;
};
