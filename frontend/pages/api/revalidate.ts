import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("[Next.js revalidating...]");
  console.log("req.body: ",JSON.parse(req.body));
  const body = JSON.parse(req.body);
  let revalidated = false;
  try {
    await res.revalidate(body.path);
    revalidated = true;
    console.log("revalidated true!");
  } catch (e) {
    console.error(e);
  }

  res.json({ revalidated });
};

export default handler;
