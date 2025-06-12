import React, { useEffect, useState } from 'react';

interface Props {
	path: string;
}

const AssetSelector: React.FC<Props> = ({ path: projectPath }) => {
	const [all, setAll] = useState<string[]>([]);
	const [query, setQuery] = useState('');

	useEffect(() => {
		window.electronAPI?.listTextures(projectPath).then(list => setAll(list));
	}, [projectPath]);

	const filtered = all.filter(n => n.includes(query));

	const handleSelect = (name: string) => {
		window.electronAPI?.addTexture(projectPath, name);
	};

	return (
		<div className="mb-4">
			<input
				className="border px-1 mb-2"
				placeholder="Search texture"
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
			<ul className="h-48 overflow-y-scroll border p-1">
				{filtered.map(n => (
					<li key={n}>
						<button className="underline text-blue-600" onClick={() => handleSelect(n)}>
							{n}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AssetSelector;
