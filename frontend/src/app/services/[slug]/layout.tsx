import type { Metadata } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://binarycraft4u-website.onrender.com/api";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarycraft4u.vercel.app";

async function getService(slug: string) {
    try {
        const res = await fetch(`${apiUrl}/services`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return (data.services || []).find((s: any) => s.slug === slug || s._id === slug) || null;
    } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = await getService(slug);
    if (!service) return { title: "Service Not Found | Binary Craft" };

    return {
        title: `${service.title} | Binary Craft Services`,
        description: service.description || `Explore ${service.title} from Binary Craft — Premium IT solutions.`,
        openGraph: {
            title: service.title,
            description: service.description,
            type: "website",
            images: service.image ? [{ url: service.image, width: 800, height: 600, alt: service.title }] : [],
            url: `${baseUrl}/services/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: service.title,
            description: service.description,
            images: service.image ? [service.image] : [],
        },
        alternates: { canonical: `${baseUrl}/services/${slug}` },
    };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
