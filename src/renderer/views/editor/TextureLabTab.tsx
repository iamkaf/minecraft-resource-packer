import React, { Suspense } from 'react';
import { Skeleton } from '../../components/daisy/feedback';
import TextureLab from '../../components/assets/TextureLab';
import { useEditor } from '../../components/providers/EditorProvider';

export default function TextureLabTab() {
  const { labFile, labStamp, setTab } = useEditor();
  if (!labFile) return <div className="p-4">No texture selected</div>;
  return (
    <Suspense fallback={<Skeleton width="100%" height="8rem" />}>
      <TextureLab
        file={labFile}
        stamp={labStamp}
        onClose={() => setTab('browser')}
      />
    </Suspense>
  );
}
