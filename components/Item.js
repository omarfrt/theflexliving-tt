import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from "styled-components";
const ItemContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
  display: flex;
`;

export default function Item({ item }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <ItemContainer ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {item.propertyName}
        </ItemContainer>
    );
}