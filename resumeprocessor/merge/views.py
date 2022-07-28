from pdf2image import pdfinfo_from_path, convert_from_path
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, HttpResponse
import os, time, glob, subprocess
from PyPDF2 import PdfFileMerger
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
flurl = str(BASE_DIR) + "/media/"


def home(request):
    return render(request,'merge/home3.html')

merge_status=[['0','Starting']]
@csrf_exempt
def merge(request):
    if request.method=="POST":  
        merge_status[0]=['0','Starting']
        base_file_directory  = str(BASE_DIR)+'/merge/docmerge/'
        base_file_save       = str(BASE_DIR)+"/merge/mergedoc/"
        for ff in os.listdir(base_file_directory):
            os.remove(base_file_directory+ff)
        for ff in os.listdir(base_file_save):
            os.remove(base_file_save+ff)
        f=request.FILES.getlist("file")
        if len(f)==0:
            merge_status[0][1]="no file choosen"
        else:
            for fl in f:  
                merge_status[0]=['0','File Uploading ...']              
                fs = FileSystemStorage(base_file_directory)
                file=str(fl)
                file=file.replace(' ','_')
                fullname = fs.save(file,fl)
            
            files = []                
            for it in os.listdir(base_file_directory):
                    files.append(base_file_directory+it)
            c=100/len(files)
            cc=0
            for f in files:
                cc+=c
                output = subprocess.call(['lowriter', '--convert-to', 'pdf' ,'--outdir',base_file_save,f])
                
                if cc<100:
                    merge_status[0]=[cc,'Processing']
                else:
                    merge_status[0]=[99,'Processing']
                
                
                
            merge_status[0]=[99.9,'Processing']
            pdfs = []
            merger = PdfFileMerger()
            c=100/len(files)
            cc=0
            for it in sorted(os.listdir(base_file_save)):
                cc+=c                
                merger.append(base_file_save+it)
                merge_status[0]=[cc,'Merging Doc']
                
            merge_status[0]=[100,'Completed']

            merger.write(str(BASE_DIR)+'/static/result/result.pdf')
            merger.close()
            print(merge_status)
            print("*************")
    return HttpResponse("done")

@csrf_exempt
def getmerge(request):
    time.sleep(1)
    print('yes')
    return HttpResponse(str(merge_status[0][0])+','+str(merge_status[0][1]))