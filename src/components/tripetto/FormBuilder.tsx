/**
 * We have received permission to use Tripetto without a license.
 * See their normal pricing here: https://tripetto.com/versions/
 */

import { useField } from 'payload/components/forms';
import React, { useState } from 'react';
import { TripettoBuilder } from '@tripetto/builder/react';
import { IDefinition } from '@tripetto/builder/module/map';

// Import component types
import '@tripetto/block-checkbox';
import '@tripetto/block-checkboxes';
import '@tripetto/block-dropdown';
import '@tripetto/block-email';
import '@tripetto/block-error';
import '@tripetto/block-evaluate';
import '@tripetto/block-file-upload';
import '@tripetto/block-hidden-field';
import '@tripetto/block-multi-select';
import '@tripetto/block-multiple-choice';
import '@tripetto/block-number';
import '@tripetto/block-paragraph';
import '@tripetto/block-radiobuttons';
import '@tripetto/block-setter';
import '@tripetto/block-stop';
import '@tripetto/block-text';
import '@tripetto/block-textarea';
import '@tripetto/block-url';
import '@tripetto/block-variable';
import '@tripetto/block-yes-no';
import '@holoenfans/tripetto-block-multi-file-upload';

type Props = { path: string };

export default function FormBuilder({ path }: Props) {
	const {
		value, setValue, showError, errorMessage,
	} = useField<IDefinition>({ path });
	const [isOpen, setIsOpen] = useState(false);

	function onChange(definition: IDefinition) {
		setValue(definition);
	}

	return (
		<>
			<div className="field-type json-field">
				<label className="field-label">
				Form
				</label>
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="btn btn--style-secondary btn--icon-style-without-border btn--size-medium btn--icon-position-right"
				>
					<span className="btn__content"><span className="btn__label">Open form builder</span></span>
				</button>
				{showError && (
					<p className="error error-message">
						{errorMessage}
					</p>
				)}
			</div>

			{isOpen && (
				<TripettoBuilder
					definition={value}
					onChange={onChange}
					disableSaveButton={true}
					disableNesting={true}
					disableEditButton={true}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
