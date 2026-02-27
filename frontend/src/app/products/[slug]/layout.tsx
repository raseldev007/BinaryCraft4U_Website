import type { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://binarycraft4u-website.onrender.com/api";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarycraft4u.vercel.app";

async function getProduct(slug: string) {
    try {
        const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return (data.products || []).find((p: any) => p.slug === slug || p._id === slug) || null;
    } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) return { title: "Product Not Found | Binary Craft" };

    return {
        title: `${product.title} | Binary Craft`,
        description: product.description || `Get ${product.title} from Binary Craft — Premium IT solutions.`,
        openGraph: {
            title: product.title,
            description: product.description,
            type: "website",
            images: product.image ? [{ url: product.image, width: 800, height: 600, alt: product.title }] : [],
            url: `${baseUrl}/products/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: product.title,
            description: product.description,
            images: product.image ? [product.image] : [],
        },
        alternates: { canonical: `${baseUrl}/products/${slug}` },
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
