package mum.cs472;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;

public class Word {
    
    public static class Definition {
        
        private final String t;
        private final String d;
        
        public Definition (String type, String definition) {
            this.t = type;
            this.d = definition;
        }

        public String getType() {
            return t;
        }

        public String getDefinition() {
            return d;
        }
    }
    
    private final String word;
    private final List<Definition> definitions = new ArrayList<>();
    
    public Word (String word) {
        this.word = word;
    }
    
    public void addDifition(String type, String definition) {
        definitions.add(new Definition(type, definition));
    }

    public String getWord() {
        return word;
    }

    public List<Definition> getDefinitions() {
        return definitions;
    }
    
    public String toJSON() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
