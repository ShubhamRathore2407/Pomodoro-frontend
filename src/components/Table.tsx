import styled from "styled-components";

const Table = () => {
  return (
    <TableWrapper>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Task</TableHeaderCell>
          <TableHeaderCell>Pomos</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Active</TableHeaderCell>
          <TableHeaderCell>Total Break Time (min)</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Task 1</TableCell>
          <TableCell>3</TableCell>
          <TableCell>Complete</TableCell>
          <TableCell>No</TableCell>
          <TableCell>15</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Task 2</TableCell>
          <TableCell>2</TableCell>
          <TableCell>Incomplete</TableCell>
          <TableCell>Yes</TableCell>
          <TableCell>10</TableCell>
        </TableRow>
        {/* Add more rows as needed */}
      </TableBody>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  //   border-radius: 5px;
  //   overflow: hidden;
`;
const TableHeader = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px 5px 0 0;
  font-weight: bold;
`;
const TableHeaderCell = styled.div`
  padding: 10px;
  border-right: 1px solid #ccc;
`;
const TableRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
`;
const TableCell = styled.div`
  padding: 10px;
  border-right: 1px solid #ccc;
  flex: 1;
  text-align: center;

  &:last-child {
    border-right: none;
  }
`;
const TableBody = styled.div``;

export default Table;
