import {
 useDroppable
} from "@dnd-kit/core";


export default function KanbanColumn({
 id,
 title,
 children
}){


const {
 setNodeRef
}=useDroppable({
 id
});


return (

<div

ref={setNodeRef}

className="
w-72
min-h-[500px]
rounded-lg
bg-muted
p-4
"

>


<h2 className="
font-semibold
mb-4
">

{title}

</h2>


<div className="
space-y-3
">

{children}

</div>


</div>

)

}