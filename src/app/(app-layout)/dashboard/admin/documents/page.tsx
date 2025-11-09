import SectionHeader from "@/components/section-header";
import SectionContent from "@/components/section-content";
import { getDocuments } from "@/features/documents/services/documents-api";
import { DocumentsTable } from "@/features/documents/components/documents-table";
import { DocumentUploadDialog } from "@/features/documents/components/document-upload-dialog";

export const metadata = {
  title: "Quản Lý Tài Liệu | Go-Electrify Admin",
  description: "Quản lý cơ sở tri thức cho chatbot AI",
};

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionHeader
        title="Quản Lý Tài Liệu"
        subtitle="Quản lý cơ sở tri thức cho chatbot hỗ trợ khách hàng được hỗ trợ bởi AI"
      >
        <DocumentUploadDialog />
      </SectionHeader>

      <SectionContent>
        <DocumentsTable data={documents} />
      </SectionContent>
    </div>
  );
}
