/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable, {ReactTableDefaults} from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

import MultiSelect from '../../core/util/multiselect';

import Checkbox from '../../ui/primitives/checkbox';

const CheckboxTable = checkboxHOC(ReactTable);

const Table = ({onSelect, data, ...props}) => (
	<MultiSelect onChange={onSelect} allItems={data.map(({_id}) => _id)}>
		{selection => (
			<CheckboxTable
				column={{
					...ReactTableDefaults.column,
					headerStyle: {
						fontWeight: 'bold'
					}
				}}
				getTrProps={(_, row) => ({
					style: {
						backgroundColor: row && selection.has(row.original._id) ? 'lightgreen' : 'inherit',
						color: row && selection.has(row.original._id) ? 'black' : 'inherit'
					}
				})}
				getTdProps={() => ({
					style: {
						display: 'flex',
						alignItems: 'center'
					}
				})}
				selectAll={selection.allSelected}
				isSelected={selection.has}
				toggleSelection={selection.toggle}
				toggleAll={selection.toggleAll}
				SelectAllInputComponent={({checked, onClick}) => (
					<Checkbox
						id="tr-all"
						isChecked={Boolean(checked)}
						onChange={() => onClick()}
					/>
				)}
				SelectInputComponent={({id, checked, onClick}) => (
					<Checkbox
						id={`tr-${id}`}
						isChecked={Boolean(checked)}
						onChange={() => onClick(id)}
					/>
				)}
				PaginationComponent={() => null}
				data={data}
				{...props}
			/>
		)}
	</MultiSelect>
);

Table.propTypes = {
	onSelect: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired
};

export default Table;
