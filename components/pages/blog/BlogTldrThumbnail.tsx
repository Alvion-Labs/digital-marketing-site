"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface BlogTldrThumbnailProps {
	src: string;
	alt: string;
	className?: string;
}

function PreviewOverlay({
	imageSrc,
	alt,
	onClose,
}: {
	imageSrc: string;
	alt: string;
	onClose: () => void;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (imgRef.current?.complete) {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return createPortal(
		<div
			className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 p-4"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label={`${alt} image preview`}
		>
			<button
				type="button"
				aria-label="Close image preview"
				onClick={onClose}
				className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-black hover:scale-110 z-10"
			>
				✕
			</button>

			{isLoading && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white">
						<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
						Loading preview...
					</div>
				</div>
			)}

			<img
				ref={imgRef}
				src={imageSrc}
				alt={alt}
				className={`max-h-[88vh] w-auto max-w-[94vw] rounded-2xl object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
				onClick={(e) => e.stopPropagation()}
			/>
		</div>,
		document.body
	);
}

export default function BlogTldrThumbnail({ src, alt, className = '' }: BlogTldrThumbnailProps) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				aria-label={`Open preview image for ${alt}`}
				onClick={() => setIsPreviewOpen(true)}
				className="appearance-none border-0 bg-transparent p-0 cursor-pointer"
			>
				<Image
					src={src}
					alt={alt}
					width={96}
					height={96}
					className="block h-auto w-auto max-h-20 max-w-20 border border-gray-300 object-contain rounded-2xl transition-transform duration-500 hover:scale-[1.01] sm:max-h-24 sm:max-w-24 md:max-h-28 md:max-w-28"
				/>
			</button>

			{isPreviewOpen && (
				<PreviewOverlay
					imageSrc={src}
					alt={alt}
					onClose={() => setIsPreviewOpen(false)}
				/>
			)}
		</>
	);
}
