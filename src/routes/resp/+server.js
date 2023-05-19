import { json } from '@sveltejs/kit';
import { secret } from '$env/static/private';

export const GET = async ({ request , url }) => {
  console.log(secret);
  const res = await fetch(`${secret}${url.searchParams.get('message')}`); //the secret is the url of the server (i dont expose it in the repo to avoid abuse of my server)
  const data = await res.json();
  return json(data);
}