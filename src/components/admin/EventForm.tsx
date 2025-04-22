
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      
      // Usando o URL da imagem gerado para o evento
      // Isso será alterado para usar upload de arquivos em uma implementação futura
      setEventData({ ...eventData, bannerUrl: imageUrl });
    }
  };
