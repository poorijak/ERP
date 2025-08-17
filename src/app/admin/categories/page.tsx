import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/features/categories/db/categories";
import CategoryForm from "@/features/categories/components/category-form";
import CategoryList from "@/features/categories/components/category-list";

interface CategoryAdminPageProps {
  searchParams: Promise<{ page?: string }>;
}

const CategoriesAdminPage = async ({
  searchParams,
}: CategoryAdminPageProps) => {
  const page = parseInt((await searchParams).page || "1");
  const limit = 1;

  const { categories, totalCount } = await getCategories(page, limit);

  if (!categories) {
    return [];
  }
  const activeCategoryCount = categories.filter(
    (c) => c.status === "Active",
  ).length;
  const inactiveCategoryCount = categories.filter(
    (c) => c.status === "Inactive",
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Category Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Category Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize your product categories efficiently
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            <span className="font-semibold text-green-600">
              {activeCategoryCount}
            </span>
            Active
          </Badge>

          <Badge
            variant="outline"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            <span className="font-semibold text-gray-500">
              {inactiveCategoryCount}
            </span>
            Inactive
          </Badge>

          <Badge
            variant="outline"
            className="px-2 py-1 text-xs sm:px-3 sm:text-sm"
          >
            <span className="font-semibold text-blue-600">
              {categories.length}
            </span>
            Total
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <CategoryForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <CategoryList
            categories={categories}
            page={page}
            limit={limit}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
};
export default CategoriesAdminPage;
