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
import React from 'shim/react';
import PropTypes from 'shim/prop-types';
import styled from 'shim/styled-components';
import ReactTable, {ReactTableDefaults} from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import mergeClassNames from 'classnames';

import MultiSelect from '../../../core/util/multiselect';

import Checkbox from '../primitives/checkbox';

const CheckboxTable = checkboxHOC(ReactTable);

const AdjustedStyles = styled.div`
	.ReactTable {
		.rt-thead {
			padding: 0 54px!important;

			.rt-th.-sort-asc {
				box-shadow: inset 0 3px 0 0 rgba(0, 181, 255, .6);
			}

			.rt-th.-sort-desc {
				box-shadow: inset 0 -3px 0 0 rgba(0, 181, 255, .6);
			}
		}

		.rt-tbody {
			height: calc(100vh - 324px);
			overflow-y: auto;
			padding: 0 54px!important;

			.rt-tr-group {
				flex-grow: 0;
			}
		}

		.rt-tr {
			position: relative;
		}

		.rt-tr.isSelected {
			background-color: lightgreen!important;
			color: black;

			a {
				color: black;
			}
		}

		.rt-tr.isHidden {
			opacity: .5;
		}

		.rt-tr.hasUnpublishedChanges::before {
			content: '';
			position: absolute;
			left: -5px;
			top: 1px;
			border-left: 2px solid #ff8700;
			height: 32px;
		}

		.rt-td {
			label {
				margin: 0;
			}
		}
	}
`;

const Table = ({onSelect, data, ...props}) => (
	<AdjustedStyles>
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
						className: mergeClassNames({
							isSelected: row && selection.has(row.original._id),
							isHidden: row && row.original.isHidden,
							hasUnpublishedChanges: row && row.original.hasUnpublishedChanges
						})
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
					SelectInputComponent={({id, checked, onClick, row}) => (
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
	</AdjustedStyles>
);

Table.propTypes = {
	onSelect: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired
};

export default Table;
