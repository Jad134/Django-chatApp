from django.shortcuts import render
from .models import Message, Chat

# Create your views here.
def index(request):
    if request.method =='POST':
      print("Received data" + request.POST['textmessage'])
      myChat = Chat.objects.get(id=2)
      Message.objects.create(text = request.POST['textmessage'], chat=myChat, author=request.user, receiver=request.user)
    return render(request, 'chat/index.html', {'username':'Jad'})