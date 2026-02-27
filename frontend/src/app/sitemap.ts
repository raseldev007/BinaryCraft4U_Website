import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarycraft4u.vercel.app";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ];

    try {
        // Fetch products
        const [productsRes, servicesRes, blogsRes] = await Promise.allSettled([
            fetch(`${apiUrl}/products?limit=100&page=1`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/services?limit=100&page=1`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/blog?limit=100&page=1`, { next: { revalidate: 3600 } }),
        ]);

        const productRoutes: MetadataRoute.Sitemap = [];
        const serviceRoutes: MetadataRoute.Sitemap = [];
        const blogRoutes: MetadataRoute.Sitemap = [];

        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
            const data = await productsRes.value.json();
            for (const product of data.products || []) {
                productRoutes.push({
                    url: `${baseUrl}/products/${product._id}`,
                    lastModified: new Date(product.updatedAt || product.createdAt),
                    changeFrequency: "weekly",
                    priority: 0.8,
                });
            }
        }

        if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
            const data = await servicesRes.value.json();
            for (const service of data.services || []) {
                serviceRoutes.push({
                    url: `${baseUrl}/services/${service._id}`,
                    lastModified: new Date(service.updatedAt || service.createdAt),
                    changeFrequency: "weekly",
                    priority: 0.8,
                });
            }
        }

        if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
            const data = await blogsRes.value.json();
            for (const blog of data.blogs || []) {
                blogRoutes.push({
                    url: `${baseUrl}/blog/${blog.slug}`,
                    lastModified: new Date(blog.updatedAt || blog.createdAt),
                    changeFrequency: "monthly",
                    priority: 0.7,
                });
            }
        }

        return [...staticRoutes, ...productRoutes, ...serviceRoutes, ...blogRoutes];
    } catch {
        return staticRoutes;
    }
}
