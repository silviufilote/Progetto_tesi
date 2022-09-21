# CoinStatus dashboard
Tesi di laurea triennale: ingegneria informatica

# Requisiti di sistema:
- Ubuntu 16.04 o versioni successive (64 bit)
- macOS 10.12.6 (Sierra) o versioni successive (64 bit) (nessun supporto GPU)
- Windows nativo - Windows 7 o versioni successive (64 bit)
- Windows WSL2 - Windows 10 19044 o versioni successive (64 bit)


# Requisiti software:
- Python 3.7–3.10 [cliccare qua](https://www.python.org/downloads/) e seguire le seguenti [indicazioni](https://www.youtube.com/watch?v=Kn1HF3oD19c&ab_channel=AmitThinks)
- Windows Native richiede [Microsoft Visual C++ ridistribuibile per Visual Studio 2015, 2017 e 2019](https://learn.microsoft.com/it-IT/cpp/windows/latest-supported-vc-redist?view=msvc-170)

- Per altre info:  [cliccare qua](https://www.tensorflow.org/install/pip#software_requirements).


# Processo di avviamento del progetto:
1. Scaricare il zip del progetto intero
2. Unzippare il progetto 
3. Spostarsi con il terminale nella cartella unzippata:

````
C:\Users\fsilv\Desktop\Progetto_tesi>dir
 Volume in drive C has no label.
 Volume Serial Number is C8DF-26E9

 Directory of C:\Users\fsilv\Desktop\Progetto_tesi

17/09/2022  14:48    <DIR>          .
17/09/2022  14:48    <DIR>          ..
04/08/2022  11:57             2.224 app.py
11/07/2022  16:21    <DIR>          env
27/06/2022  23:20             1.147 model.py
04/08/2022  11:44             6.707 neural.py
11/07/2022  16:12                67 README.md
11/07/2022  16:21    <DIR>          static
29/07/2022  12:40    <DIR>          templates
04/08/2022  11:47    <DIR>          __pycache__
               4 File(s)         10.145 bytes
               6 Dir(s)  142.987.628.544 bytes free
````

4. Raggiunta la cartella eseguire il seguente codice:

````
pip install -r requirements.txt
````


5. Successivamente eseguire:

````
python app.py
````

6. Con il browser spostartsi su [localhost](http://127.0.0.1:80). 
7. Per la chiusura del server eseguire sempre all'interno del terminale dove avete avviato il progetto CTRL+C

````
C:\Users\fsilv\Desktop\Progetto_tesi>python app.py
/forecast.html
/neural.html
/metrics.html
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on all addresses.
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://192.168.1.2:80/ (Press CTRL+C to quit)
127.0.0.1 - - [21/Sep/2022 12:23:06] "GET / HTTP/1.1" 200 -
````
