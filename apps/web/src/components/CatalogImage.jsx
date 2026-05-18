import React, { useEffect, useMemo, useState } from 'react';
import { getRecordImageCandidates } from '@/lib/catalog';
import { CATALOG_IMAGE_PLACEHOLDER } from '@/utils/catalogPlaceholder.js';

/**
 * Catalog image with variant/extension fallback (webp → jpg) before placeholder.
 */
const CatalogImage = ({
  record,
  imageOptions,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
}) => {
  const candidates = useMemo(
    () => getRecordImageCandidates(record, imageOptions),
    [record, imageOptions?.thumb, imageOptions?.size]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [candidates.join('|')]);

  const src =
    index < candidates.length ? candidates[index] : CATALOG_IMAGE_PLACEHOLDER;

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={className}
      onError={() => {
        setIndex((i) => (i < candidates.length ? i + 1 : i));
      }}
    />
  );
};

export default CatalogImage;
