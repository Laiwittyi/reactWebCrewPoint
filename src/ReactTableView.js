import React, { useState } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';

// Sample Data
const data = [
    { id: 1, name: 'Alice', date: '2024-01-01' },
    { id: 2, name: 'Bob', date: '2024-01-02' },
    { id: 3, name: 'Charlie', date: '2024-01-03' },
    { id: 4, name: 'David', date: '2024-01-04' },
    { id: 5, name: 'Eve', date: '2024-01-05' },
    // Add more sample data as needed
];

// Name Filter
const NameFilter = ({ column }) => {
    return (
        <input
            type="text"
            onChange={e => column.setFilter(e.target.value)}
            placeholder={`Search ${column.id}`}
        />
    );
};

// Date Filter
const DateFilter = ({ column }) => {
    return (
        <input
            type="date"
            onChange={e => column.setFilter(e.target.value)}
        />
    );
};

const Table = (pageIndexParam, pageSizeParam, setPageIndexParam, setPageSizeParam) => {

    const columns = React.useMemo(() => [
        {
            Header: 'Name',
            accessor: 'name', // accessor is the "key" in the data
            Filter: NameFilter
        },
        {
            Header: 'Date',
            accessor: 'date',
            Filter: DateFilter
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setFilter,
        gotoPage,
        pageOptions,
        pageCount,
        canPreviousPage,
        canNextPage,
        page,
        nextPage,
        previousPage,
        setPageIndexParam,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndexParam, pageSizeParam }
        },
        useFilters,
        usePagination
    );

    return (
        <>
            <table {...getTableProps()} style={{ border: 'solid 1px black', width: '100%' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndexParam + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <select
                    value={pageSizeParam}
                    onChange={e => {
                        setPageIndexParam(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

const ReactTableView = () => {

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    return (
        <div>
            <h1>React Pagination Table with Filters</h1>
            <Table pageIndexParam={pageIndex} pageSizeParam={pageSize} setPageIndexParam={setPageIndex} setPageSizeParam={setPageSize} />
        </div>
    );
};

export default ReactTableView;
