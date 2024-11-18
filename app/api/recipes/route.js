import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "$natural";
    const order = searchParams.get("order") || "asc";
    const category = searchParams.get("category") || "";
    const tags = searchParams.getAll("tags[]");
    const tagMatchType = searchParams.get("tagMatchType") || "all";
    const ingredients = searchParams.getAll("ingredients[]");
    const ingredientMatchType =
      searchParams.get("ingredientMatchType") || "all";
    const numberOfSteps = searchParams.get("numberOfSteps");

    const client = await clientPromise;
    const db = client.db("devdb");

    const query = {};

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    if (category) {
      query.category = category;
    }

    if (tags.length > 0) {
      if (tagMatchType === "all") {
        query.tags = { $all: tags };
      } else {
        query.tags = { $in: tags };
      }
    }

    if (ingredients.length > 0) {
      if (ingredientMatchType === "all") {
        query.$and = ingredients.map((ing) => ({
          [`ingredients.${ing}`]: { $exists: true },
        }));
      } else {
        query.$or = ingredients.map((ing) => ({
          [`ingredients.${ing}`]: { $exists: true },
        }));
      }
    }

    if (numberOfSteps) {
      const stepsCount = parseInt(numberOfSteps, 10);
      if (!isNaN(stepsCount)) {
        query.instructions = { $size: stepsCount };
      }
    }

    const skip = (page - 1) * limit;

    let sortObject = { $natural: 1 };
    if (sortBy !== "$natural") {
      if (sortBy === "instructionCount") {
        const pipeline = [
          { $match: query },
          {
            $addFields: {
              instructionCount: { $size: "$instructions" },
            },
          },
          { $sort: { instructionCount: order === "asc" ? 1 : -1 } },
          { $skip: skip },
          { $limit: limit },
        ];

        const recipes = await db
          .collection("recipes")
          .aggregate(pipeline)
          .toArray();
        const total = await db.collection("recipes").countDocuments(query);

        return NextResponse.json({
          recipes,
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
        });
      } else {
        sortObject = { [sortBy]: order === "asc" ? 1 : -1 };
      }
    }

    const [recipes, total] = await Promise.all([
      db
        .collection("recipes")
        .find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("recipes").countDocuments(query),
    ]);

    return NextResponse.json({
      recipes,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Error fetching recipes" },
      { status: 500 }
    );
  }
}
