from ai.main_generator import MainGenerator

if __name__ == '__main__':
  mg = MainGenerator()
  
  mg.ingest(
    "https://docpop.org/2013/10/way-ahead-of-its-time-the-remote-lounge-nyc/",
    email="alexbrodriguez@gmail.com",
    lossy=True
  )