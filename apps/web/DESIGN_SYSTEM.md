# FeelingCare Design System

## Direction

FeelingCare doit ressembler a une application d'ecoute moderne : lumineuse, rassurante, calme, avec quelques accents visuels doux. La reference visuelle apporte la clarte, les cartes arrondies et la douceur, mais l'interface ne doit jamais donner l'impression de noter, diagnostiquer ou gamifier les emotions.

## Palette

### Light mode

```txt
Canvas:      #FCFCF7
Surface:     #FFFFFF
Surface 2:   #F6F7EF
Text:        #171717
Text muted:  #697066
Border:      #E8EBDD
Primary:     #DDF241
Pink:        #F3B6EF
Blue:        #9DD9EA
Coral:       #FF755F
Mint:        #BDECC8
```

### Dark mode

```txt
Canvas:      #11130F
Surface:     #191C16
Surface 2:   #20251B
Text:        #F7F8EF
Text muted:  #B8BDAF
Border:      #343A2E
Primary:     #DDF241
Pink:        #F3B6EF
Blue:        #9DD9EA
Coral:       #FF8A75
Mint:        #BDECC8
```

## Principes UI

- Fond general tres clair, sans gros degrade.
- Cartes blanches ou colorees, rayon 24px pour les modules importants, 16px pour les controles.
- Bordures legeres, ombres douces et compactes.
- Boutons principaux lime avec texte noir.
- Les accents rose, bleu et corail servent a differencier les zones de lecture, pas a classer l'utilisateur.
- Les icones remplacent les symboles textuels quand c'est possible.
- Les pages d'application doivent montrer l'usage directement, pas une landing page marketing.
- Eviter les scores bruts type `7/10`, les smileys trop ludiques et les formulations de performance.

## Composants

### Boutons

- Primary: `bg-feelingcare-primary text-feelingcare-light-text`
- Secondary: surface blanche, bordure discrete, hover lime pale.
- Destructive: corail/rose, jamais rouge agressif.
- Rayon: `rounded-2xl` ou `rounded-full` selon le contexte.

### Inputs

- Fond blanc ou `surface-soft`.
- Bordure `#E8EBDD`.
- Focus lime avec halo doux.
- Hauteur confortable, minimum 48px.

### Cards

- Rayon principal: 24px.
- Padding: 20-28px.
- Ombre: `0 18px 45px rgba(23, 23, 23, 0.08)`.
- Les cartes colorees doivent rester lisibles avec texte noir doux.

## Typographie

- Titres: 28-40px selon l'ecran, gras mais pas trop serre.
- Sections: 18-22px.
- Body: 14-16px.
- Pas de letter-spacing negatif.

## Accents Emotionnels

```txt
Calme:       #BDECC8
Stress:      #FFD8A8
Fatigue:     #F3B6EF
Tristesse:   #9DD9EA
Colere:      #FF755F
Neutre:      #DDF241
```

## Ton Produit

FeelingCare doit donner l'impression d'un compagnon discret : clair, humain, stable. Le design doit aider a se sentir compris, a retrouver quelques reperes personnels et a revenir doucement vers une conversation, sans pression ni jugement.
