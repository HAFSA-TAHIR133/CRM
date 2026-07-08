import {
 useDraggable
} from "@dnd-kit/core";


import {
 Card,
 CardContent,
 CardHeader,
 CardTitle
} from "@/components/ui/card";


import {
 Badge
} from "@/components/ui/badge";


export default function LeadCard({
 lead
}){


const {
 attributes,
 listeners,
 setNodeRef,
 transform
}=useDraggable({

id:lead.id

});


const style = transform
?
{
 transform:
 `translate3d(${transform.x}px,${transform.y}px,0)`
}
:
undefined;



return (

<div

ref={setNodeRef}

style={style}

{...listeners}

{...attributes}

>


<Card className="
cursor-grab
">


<CardHeader>

<CardTitle className="text-base">

{lead.name}

</CardTitle>


</CardHeader>



<CardContent>


<p className="text-sm">

{lead.company}

</p>


<p className="text-sm text-muted-foreground">

{lead.email}

</p>



<Badge className="mt-3">

{lead.status}

</Badge>



</CardContent>


</Card>


</div>

)

}