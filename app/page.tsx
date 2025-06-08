import { SimpleLayout } from '@/components/layout'

import { initializeSearchIndex } from "@/components/algolia/lib/data-service"
import { InteractiveSearchDashboard } from "@/components/view/home/InteractiveSearchDashboard"

export default async function DashboardPage() {
    
    await initializeSearchIndex()

    return (
        <>
            <SimpleLayout>
                <InteractiveSearchDashboard />
            </SimpleLayout>
        </>
    );
}

export const dynamic = "force-dynamic"
