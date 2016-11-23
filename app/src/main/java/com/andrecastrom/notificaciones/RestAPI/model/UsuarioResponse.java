package com.andrecastrom.notificaciones.RestAPI.model;

/**
 * Created by 47369176d on 18/11/2016.
 */

public class UsuarioResponse {

    private String id;
    private String token;
    private String animal;

    public UsuarioResponse() {
    }

    public UsuarioResponse(String id, String token, String animal) {
        this.id = id;
        this.token = token;
        this.animal = animal;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAnimal() {
        return animal;
    }

    public void setAnimal(String animal) {
        this.animal = animal;
    }
}
