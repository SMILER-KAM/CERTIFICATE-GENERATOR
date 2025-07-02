const canvas = document.getElementById('certificatecanvas');
const ctx = canvas.getContext('2d');
const image = new Image();
image.src = 'sample.jpg'; 

image.onload = function () 
{
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    document.getElementById('btn1').style.display='inline-block'
}

let namesarray=[]
let currentindex=0
let certificateimage=[]

function generate()
{
    const input=document.getElementById("name").value
    if (!input)
    {
        alert("Please enter a name");
    }
    else
    {
        namesarray=input
        .split(',')
        .map(name=>name.trim())
        .filter(name=>name.length>0)
        currentindex=0
        drawcertificate(namesarray[currentindex])
    }
}

function drawcertificate(name)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.font = "100px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.fillText(name, 650, 650);
    document.getElementById('btn2').style.display='inline-block'
    document.getElementById('btn3').style.display='inline-block'
    document.getElementById('result').textContent = "Certificate Generated successfully!";

    const imgdataurl= canvas.toDataURL("image/png");
    certificateimage[currentindex]=imgdataurl
}


async function final() 
{
    if(confirm("Are you sure you want to download the certificate?"))
    {
        if (!namesarray.length) 
        {
            alert("Please generate the certificate first.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const zip = new JSZip()
        for(let i=0;i<namesarray.length;i++)
        {
            if (!certificateimage[i]) 
            {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0);
                ctx.font = "100px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "top";
                ctx.fillText(namesarray[i], 650, 650);
                certificateimage[i] = canvas.toDataURL("image/png");
            }
            const pdf = new jsPDF
            ({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

            const pdfBlob = pdf.output('blob');
            zip.file(`${namesarray[i].replace(/\s+/g, '_')}.pdf`, pdfBlob);
        }
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "certificates.zip";
        document.body.appendChild(link);
        link.click();
        link.remove();

        document.getElementById('result').textContent = "All PDFs zipped and downloaded successfully!";
    }
}

function next()
{
    currentindex++
    if(currentindex < namesarray.length)
    {
        drawcertificate(namesarray[currentindex])
    }
    else
    {
        alert("All Certificates have been generated.")
        document.getElementById('btn2').style.display = 'none';
        document.getElementById('btn3').style.display = 'none'; 
        document.getElementById('result').textContent = "";
    }
}