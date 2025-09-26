import { supabase } from "./supabaseClient";

export async function fetchPublicSitters() {
  const { data, error } = await supabase.from("v_public_sitters").select("*");
  if (error) throw error;
  return data;
}

export async function fetchPublicRequests() {
  const { data, error } = await supabase.from("v_public_requests").select("*");
  if (error) throw error;
  return data;
}

export async function registerClientProfile({
  name,
  email,
  phone,
  neighborhood,
}: {
  name: string;
  email: string;
  phone: string;
  neighborhood: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("profiles").upsert({
    id: user.id,
    name,
    email,
    phone,
    user_type: "client",
    neighborhood,
  });

//   const {data: userData, error: userError} = await supabase.from("profiles").select("id").eq("id", user.id).single();
//   if (userError) throw userError;

//   console.log({userData, userError})
  await supabase.from("clients").upsert({ profile_id: user.id });
  return true;
//   return userData;
}

export async function addClientDog(input: {
  client_id: string;
  name: string;
  breed: string;
  age: number;
  size: "small" | "medium" | "large";
  image?: string;
  additional_info?: string;
}) {
  const { error } = await supabase.from("dogs").insert({
    client_id: input.client_id,
    name: input.name,
    breed: input.breed,
    age: input.age,
    size: input.size,
    image: input.image,
    additional_info: input.additional_info,
  });
  if (error) throw error;
}

export async function registerSitterProfile(input: {
  fullName: string;
  email: string;
  phone: string;
  description?: string;
  neighborhoods: string[];
  services: Array<{
    service_type: "walk_30" | "walk_60" | "home_visit";
    price_cents: number;
  }>;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("profiles").upsert({
    id: user.id,
    name: input.fullName,
    email: input.email,
    phone: input.phone,
    user_type: "sitter",
  });
  await supabase.from("sitters").upsert({
    profile_id: user.id,
    description: input.description,
    neighborhoods: input.neighborhoods,
  });
  // Upsert services
  for (const s of input.services) {
    await supabase.from("sitter_services").upsert({
      sitter_id: user.id,
      service_type: s.service_type,
      price_cents: s.price_cents,
    });
  }
}

export async function createRequest(input: {
  client_id: string;
  dog_id: string;
  service_type: "walk_30" | "walk_60" | "home_visit";
  date: string; // yyyy-mm-dd
  time: string;
  neighborhood: string;
  special_instructions?: string;
  offered_price_cents: number;
  flexible: boolean;
}) {
  const { error } = await supabase.from("requests").insert({
    client_id: input.client_id,
    dog_id: input.dog_id,
    service_type: input.service_type,
    date: input.date,
    time: input.time,
    neighborhood: input.neighborhood,
    special_instructions: input.special_instructions,
    offered_price_cents: input.offered_price_cents,
    flexible: input.flexible,
  });
  if (error) throw error;
}

export async function createDogThenRequest(params: {
  client_id: string;
  dog: {
    name: string;
    breed: string;
    age: number;
    size: "small" | "medium" | "large";
    image?: string;
    additional_info?: string;
  };
  request: {
    service_type: "walk_30" | "walk_60" | "home_visit";
    date: string;
    time: string;
    neighborhood: string;
    special_instructions?: string;
    offered_price_cents: number;
    flexible: boolean;
  };
}) {
  const { data: dogInsert, error: dogErr } = await supabase
    .from("dogs")
    .insert({
      client_id: params.client_id,
      name: params.dog.name,
      breed: params.dog.breed,
      age: params.dog.age,
      size: params.dog.size,
      image: params.dog.image,
      additional_info: params.dog.additional_info,
    })
    .select("id")
    .single();
  if (dogErr) throw dogErr;
  const dog_id = dogInsert.id as string;
  await createRequest({
    client_id: params.client_id,
    dog_id,
    service_type: params.request.service_type,
    date: params.request.date,
    time: params.request.time,
    neighborhood: params.request.neighborhood,
    special_instructions: params.request.special_instructions,
    offered_price_cents: params.request.offered_price_cents,
    flexible: params.request.flexible,
  });
}

export async function expressInterest(
  request_id: string,
  sitter_id: string,
  created_by: string
) {
  const { data, error } = await supabase.rpc("express_interest", {
    p_request_id: request_id,
    p_sitter_id: sitter_id,
    p_created_by: created_by,
  });
  if (error) throw error;
  return data as string; // chat_id
}

export async function clientContactSitter(
  client_id: string,
  sitter_id: string,
  created_by: string
) {
  const { data, error } = await supabase.rpc("client_contact_sitter", {
    p_client_id: client_id,
    p_sitter_id: sitter_id,
    p_created_by: created_by,
  });
  if (error) throw error;
  return data as string; // chat_id
}

export async function initiatePayment(params: {
  chat_id: string;
  client_id: string;
  sitter_id: string;
  amount_cents: number;
  success_url: string;
  cancel_url: string;
}) {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (await supabase.auth.getSession()).data.session?.access_token || ""
        }`,
      },
      body: JSON.stringify({ ...params, currency: "ils" }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Payment init failed");
  return data.url as string;
}
